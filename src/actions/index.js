export const createSession = (session) => {
  return (
    {
      type: "CREATE_SESSION",
      payload: session
    }
  )
}

export const createClient = (client) => {
  return {
    type: "CREATE_CLIENT",
    payload: client
  }
}

export const createProduct = (product) => {
  return {
    type: "CREATE_PRODUCT",
    payload: product
  }
}

export const signIn = (credentials) => {
  return async (dispatch, getState, { getFirebase }) => {
    const result = await getFirebase().login(credentials);
    try {

    } catch (err) {

    }
    return getFirebase().login(credentials)
      .then((res) => {
        console.log("success")
      }).catch(error => {
        console.log(error)
      })

  }
}


export const postChannelName = (channelName, uid) => {
  return async (dispatch, getState, { getFirestore, getFirebase }) => {
    console.log("saving channel to database...")
    const fireStore = await getFirestore()
    try {
      await fireStore.collection("channels").doc(channelName).set({
        owner: uid
      })
      console.log("successfully added channel ")
    } catch (err) {
      console.log(err)
    }
  }
}
