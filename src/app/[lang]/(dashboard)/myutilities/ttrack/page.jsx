'use client'
import TimerApp from './TimerApp'
import TimerApp2 from './TimerApp2'
import TaskManager from './TaskManager'

function Page() {//{ signOut, user }) {
  return <>    
   <TimerApp displayAs="toolbar"></TimerApp>
     {/* <TimerApp2></TimerApp2> */}
    <TaskManager></TaskManager>
  </>
}

export default Page
