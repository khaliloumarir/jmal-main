import { apiHash, apiId } from "../config";
import validator from "validator";
import { Api, TelegramClient, sessions } from "telegram";
export async function checkConnection(props, navigate, setIsClientLoaded) {
  if (!props.client) {
    if (props.session.length) {
      const session = new sessions.StringSession(props.session);
      const client = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 5,
      });

      await client.connect();
      if (await client.checkAuthorization()) {
        props.createClient(client);
        setIsClientLoaded(true);
      } else {
        props.createSession("");
        navigate("/");
        setIsClientLoaded(true);
      }
    } else {
      navigate("/");
      setIsClientLoaded(true);
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
    } else {
      return false;
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
      } else {
        return false;
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
      if (category === productItem.Category) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
  return newData;
}

export function getPictureData(item, client) {
  return new Promise(async (resolve, reject) => {
    //contains videos
    if (
      item.media.document &&
      item.media.document.mimeType.split("/")[0] !== "video"
    ) {
      const { document } = item.media;
      const picture = await client.invoke(
        new Api.upload.GetFile({
          precise: false,
          cdnSupported: true,
          location: new Api.InputDocumentFileLocation({
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
    }
    // else

    //contains photos only
    else if (item.media.photo) {
      const { photo } = item.media;
      const picture = await client.invoke(
        new Api.upload.GetFile({
          precise: true,
          cdnSupported: true,
          location: new Api.InputPhotoFileLocation({
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
  let found = false;
  let limit = 10;
  try {
    const result = await props.client?.invoke(
      new Api.messages.GetHistory({
        peer: params.channel ? params.channel : "sellaprod",
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
          if (message.groupedId === groupId) {
            if (!found) {
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
  addKey(key, detail) {
    if (detail.indexOf(key) > -1) {
      const value = detail.split(key)[detail.split(key).length - 1].split(":")[
        detail.split(key).length - 1
      ];
      this.product[key] =
        typeof value === "string" ? validator.trim(value) : value;
    }
  }
  addProperty(keyName, value) {
    this.product[keyName] = value;
  }
  filter(requirementKeys, detail) {
    for (let index = 0; index < requirementKeys.length; index++) {
      const element = requirementKeys[index];
      if (detail.indexOf(element) > -1 && detail.indexOf(element) === 0) {
        //Product has that detail
        const keyName = element.split(":")[0];
        const value = detail.split(element).join("");
        this.product[keyName] =
          typeof value === "string" ? validator.trim(value) : value;
      }
    }
  }
  isValid(requirementKeys) {
    let isValid = true;

    requirementKeys.forEach((key) => {
      const keyName = key.split(":")[0];
      if (!Object.keys(this.product).includes(keyName)) {
        isValid = false;
      }
    });
    return isValid;
  }
}

export async function validMessages(algorithmResult, props, channelName) {
  const { groups, nextBatch } = algorithmResult;
  const requirementKeys = ["Name:", "Price:", "Category:", "Contact:"];
  const productsList = [];
  for (let index = 0; index < groups.length; index++) {
    const group = groups[index];
    const lastElement = group.length - 1;
    const product = new ProductClass(channelName);
    group[lastElement]?.message.split("\n").forEach((productKey) => {
      product.addKey("Minimum", productKey);
      product.addKey("Quantity", productKey);
      product.addKey("Sizes", productKey);
      product.addKey("Channel", productKey);
      product.addProperty("date", convertToDate(group[lastElement].date));
      product.filter(requirementKeys, productKey);
    });
    if (product.isValid(requirementKeys)) {
      //add the first image
      const image = await getPictureData(group[lastElement], props.client);

      product.addProperty("image", image.bytes);
      //add description
      const indexOfDescription =
        group[group.length - 1].message.indexOf("Description:");
      if (indexOfDescription > -1) {
        const descriptionMessage = group[lastElement].message
          .slice(indexOfDescription)
          .split("Description:")
          .join("");
        product.addProperty("Description", descriptionMessage);
      }
      const mediasArray = [];
      group.forEach(async (message, index) => {
        if (!(index === group.length - 1)) {
          //if media is a picture then add it

          mediasArray.push(await getPictureData(message, props.client));
        }
      });
      product.addProperty("media", mediasArray);
      productsList.push(product.product);
    }
  }

  return { productsList, nextBatch };
}
