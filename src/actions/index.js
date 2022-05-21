export const createSession = (session) => {
  return {
    type: "CREATE_SESSION",
    payload: session,
  };
};

export const createClient = (client) => {
  return {
    type: "CREATE_CLIENT",
    payload: client,
  };
};

export const createProduct = (product) => {
  return {
    type: "CREATE_PRODUCT",
    payload: product,
  };
};

export const signIn = (credentials) => {
  return async (dispatch, getState, { getFirebase }) => {
    try {
      await getFirebase().login(credentials);
    } catch (err) {}
    return getFirebase()
      .login(credentials)
      .then((res) => {})
      .catch((error) => {});
  };
};

export const postChannelName = (channelName, uid) => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    const fireStore = await getFirestore();
    try {
      await fireStore
        .collection("channels")
        .doc(`${channelName}`)
        .set({
          owner: `${uid}`,
          created_at: new Date(),
        });
    } catch (err) {}
  };
};
//TODO:add the below
// export const addUserToTg = (channelName, uid) => {
//   return async (dispatch, getState, { getFirestore, getFirebase }) => {
//     console.log("saving user to database...");
//     const fireStore = await getFirestore();
//     try {
//       await fireStore.collection("users").doc(uid).set({
//         created_at: new Date()
//       });
//       console.log("successfully added user");
//     } catch (err) {
//       console.log(err);
//     }
//   };
// };
