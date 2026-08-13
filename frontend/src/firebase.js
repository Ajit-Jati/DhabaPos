import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, reload, sendEmailVerification, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { doc, getDoc, getFirestore, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'

const config={apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID}
export const firebaseReady=Object.values(config).every(Boolean)
const app=firebaseReady?initializeApp(config):null
export const auth=app?getAuth(app):null
export const firestore=app?getFirestore(app):null
if(auth) setPersistence(auth,browserLocalPersistence)
export const observeSession=callback=>auth?onAuthStateChanged(auth,callback):()=>{}
export const login=(email,password)=>signInWithEmailAndPassword(auth,email,password)
export const resetPassword=email=>sendPasswordResetEmail(auth,email)
export const logout=()=>signOut(auth)
export async function loginWithGoogle(){
  const provider=new GoogleAuthProvider()
  provider.setCustomParameters({prompt:'select_account'})
  return signInWithPopup(auth,provider)
}
export async function register(email,password,restaurantName){
  const credential=await createUserWithEmailAndPassword(auth,email,password)
  await sendEmailVerification(credential.user)
  const restaurantId=crypto.randomUUID()
  await setDoc(doc(firestore,'restaurants',restaurantId),{name:restaurantName||'DhabaPOS',ownerId:credential.user.uid,ownerEmail:credential.user.email||email,createdAt:serverTimestamp()})
  await setDoc(doc(firestore,'restaurants',restaurantId,'users',credential.user.uid),{email,role:'owner',restaurantId,createdAt:serverTimestamp()})
  await setDoc(doc(firestore,'users',credential.user.uid),{email:credential.user.email||email,restaurantId,role:'owner',createdAt:serverTimestamp()})
  localStorage.setItem(`dhabapos-restaurant-${credential.user.uid}`,restaurantId)
  return credential.user
}
export async function getRestaurantId(user){
  const key=`dhabapos-restaurant-${user.uid}`
  const cached=localStorage.getItem(key)
  if(cached)return cached
  const profile=await getDoc(doc(firestore,'users',user.uid))
  if(!profile.exists()){
    const restaurantId=crypto.randomUUID()
    await setDoc(doc(firestore,'restaurants',restaurantId),{name:user.displayName||'DhabaPOS',ownerId:user.uid,ownerEmail:user.email||'',createdAt:serverTimestamp()})
    await setDoc(doc(firestore,'restaurants',restaurantId,'users',user.uid),{email:user.email||'',role:'owner',restaurantId,createdAt:serverTimestamp()})
    await setDoc(doc(firestore,'users',user.uid),{email:user.email||'',restaurantId,role:'owner',createdAt:serverTimestamp()})
    localStorage.setItem(key,restaurantId)
    return restaurantId
  }
  const restaurantId=profile.data().restaurantId
  localStorage.setItem(key,restaurantId)
  return restaurantId
}
export const observeWorkspace=(restaurantId,next,error)=>onSnapshot(doc(firestore,'restaurants',restaurantId,'workspace','current'),next,error)
export const saveWorkspace=(restaurantId,userId,data)=>setDoc(doc(firestore,'restaurants',restaurantId,'workspace','current'),{data,updatedAt:serverTimestamp(),updatedBy:userId},{merge:true})
export const resendVerification=user=>sendEmailVerification(user)
export const refreshUser=user=>reload(user)
