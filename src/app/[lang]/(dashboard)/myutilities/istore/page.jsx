'use client'
import IStore from './IStore';

function Page() {//{ signOut, user }) {
  return <>
    {/* <h1>Hello {user.username}</h1>
    <button onClick={signOut}>Sign out</button> */}
    <IStore></IStore>
  </>
}

export default Page
