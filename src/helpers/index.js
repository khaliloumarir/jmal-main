import { apiHash, apiId } from "../config";
export async function checkConnection(props, navigate, setIsClientLoaded) {
  if (!props.client) {
    if (props.session) {
      console.log("creating a new client...");
      const session = new window.telegram.sessions.StringSession(props.session);
      const client = new window.telegram.TelegramClient(
        session,
        apiId,
        apiHash,
        {
          connectionRetries: 5,
        }
      );

      await client.connect();
      if (await client.checkAuthorization()) {
        props.createClient(client);
        setIsClientLoaded(true);
      } else {
        navigate("../telegram");
      }
    } else {
      navigate("../telegram");
    }
  } else {
    setIsClientLoaded(true);
  }
}

export const errors = {
  session: "401: SESSION_REVOKED",
};

export function convertToDate(telegramDate) {
  if (telegramDate) {
    const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(telegramDate);
    return d;
  }
}

export function sortPerDate(messagesToShow) {
  //sorting as LIFO
  messagesToShow.sort((a, b) => {
    const firstDate = convertToDate(a[a.length - 1]?.date);
    const secondDate = convertToDate(b[b.length - 1]?.date);
    if (firstDate < secondDate) {
      return true;
    }
  });
  return messagesToShow;
}

export function filterByDate(data, days) {
  //get the now date
  const now = Math.floor(Date.now() / 1000);
  let dateFilter = days * 86400;
  const newData = data.filter((productItem) => {
    const date = Math.floor(new Date(productItem.date) / 1000);
    if (dateFilter >= 86400) {
      if (Math.abs(now - date) <= dateFilter) {
        return true;
      }
    } else {
      return true;
    }
  });
  return newData;
}

export function filterByCategory(data, category) {
  const newData = data.filter((productItem) => {
    if (category.length) {
      if (category == productItem.Category) {
        return true;
      }
    } else {
      return true;
    }
  });
  return newData;
}

export function getPictureData(item, client) {
  return new Promise(async (resolve, reject) => {
    if (item.media.document) {
      const { document } = item.media;
      const picture = await client.invoke(
        new window.telegram.Api.upload.GetFile({
          precise: false,
          cdnSupported: true,
          location: new window.telegram.Api.InputDocumentFileLocation({
            id: document.id.value,
            accessHash: document.accessHash.value,
            fileReference: document.fileReference,
            thumbSize: "",
          }),
          offset: 0,
          limit: 1048576,
        })
      );
      return resolve(picture);
    } else if (item.media.photo) {
      const { photo } = item.media;
      const picture = await client.invoke(
        new window.telegram.Api.upload.GetFile({
          precise: true,
          cdnSupported: true,
          location: new window.telegram.Api.InputPhotoFileLocation({
            id: photo.id.value,
            accessHash: photo.accessHash.value,
            fileReference: photo.fileReference,
            thumbSize: photo.sizes[photo.sizes.length - 1].type,
          }),
          offset: 0,
          limit: 1048576,
        })
      );
      return resolve(picture);
    }
  });
}
export async function getGroups(params, props, newBatch) {
  let nextBatch = newBatch;
  console.log("next batch:", nextBatch);
  let found = false;
  let limit = 10;
  try {
    const result = await props.client?.invoke(
      new window.telegram.Api.messages.GetHistory({
        peer: params.channel ? params.channel : "santochi1337",
        offsetId: 0,
        offsetDate: 0,
        addOffset: nextBatch,
        limit,
        maxId: 0,
        minId: 0,
        hash: 0,
      })
    );
    const groups = {};
    const messagesToShow = [];
    result.messages.forEach(async (item) => {
      if (!item.groupedId) {
        //if message has a media, then this is a valid message
        if (item.media) {
          //TODO:Clean up this spaguetti
          const group = {};
          const single = (group[item.groupedId] = []);
          single.push(item);
          messagesToShow.push(single);
        }
      } else {
        //message belongs to a group
        const id = item.groupedId;
        if (!groups[id]) {
          groups[id] = [];
        }
        groups[id].push(item);
      }
    });

    const allGroups = Object.keys(groups);
    allGroups.forEach((groupId) => {
      let isValidGroup = false;
      const element = groups[groupId];
      //check if last element of a group has caption
      if (element[element.length - 1].message.length) {
        isValidGroup = true;
      } else {
        //if it doesn't then subtract the length of that group from totalOffset
        result.messages.forEach((message, index) => {
          if (message.groupedId == groupId) {
            if (!found) {
              console.log(
                "index of this group in the result object is:",
                index
              );
              nextBatch += index;
              found = true;
            }
          }
        });
      }
      //Group has the caption too (caption is always the last of the message group)
      if (isValidGroup) {
        messagesToShow.push(groups[groupId]);
      }
    });
    if (!found) {
      nextBatch += limit;
    }

    return { groups: sortPerDate(messagesToShow), nextBatch };
  } catch (err) {
    /*  if (err.message.indexOf("401: SESSION_REVOKED") > -1) {
             //session has expired
             navigate("../telegram")
         } */
  }
}

export class ProductClass {
  constructor(channelName) {
    this.product = {};
    this.product.channelName = channelName;
  }
  addData(keyName, data) {
    this.product[keyName] = data;
  }
  addKey(key, detail) {
    if (detail.indexOf(key) > -1) {
      const value = detail.split(key)[detail.split(key).length - 1].split(":")[
        detail.split(key).length - 1
      ];
      this.product[key] = value;
    }
  }
  addProperty(keyName, value) {
    this.product[keyName] = value;
  }
  filter(requirementKeys, detail) {
    for (let index = 0; index < requirementKeys.length; index++) {
      const element = requirementKeys[index];
      if (detail.indexOf(element) > -1) {
        //Product has that detail
        const value = detail
          .split(element)
          [detail.split(element).length - 1].split(":")[
          detail.split(element).length - 1
        ];
        this.product[element] = value;
      }
    }
  }
  isValid(requirementKeys) {
    let isValid = true;

    requirementKeys.forEach((key) => {
      if (!Object.keys(this.product).includes(key)) {
        isValid = false;
      }
    });
    return isValid;
  }
}

export async function validMessages(algorithmResult, props, channelName) {
  const { groups, nextBatch } = algorithmResult;
  const requirementKeys = ["Name", "Price", "Category", "Contact"];
  const productsList = [];
  for (let index = 0; index < groups.length; index++) {
    const group = groups[index];
    const lastElement = group.length - 1;
    const product = new ProductClass(channelName);
    group[lastElement]?.message.split("\n").forEach((productKey) => {
      product.addKey("Minimum", productKey);
      product.addKey("Quantity", productKey);
      product.addKey("Sizes", productKey);
      product.addProperty("date", convertToDate(group[lastElement].date));
      product.filter(requirementKeys, productKey);
    });
    if (product.isValid(requirementKeys)) {
      //add the first image
      const image = await getPictureData(group[lastElement], props.client);
      product.addData("channelName", channelName);
      product.addData("image", image.bytes);
      productsList.push(product.product);
    }
  }

  return { productsList, nextBatch };
}
