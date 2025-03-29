import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Search from './Pages/Search/Search'
import Videopage from './Pages/Videopage/Videopage'
import Channel from './Pages/Channel/Channel'
import Library from './Pages/Library/Library'
import VideoCallPage from './Pages/VideoCallPage/VideoCallPage'

const Allroutes = ({seteditcreatechanelbtn, setvideouploadpage}) => {
  return (
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/search/:Searchquery' element={<Search/>}/>
        <Route path='/videopage/:vid' element={<Videopage/>}/>
        <Route path='/Library' element={<Library/>}/>
        <Route path='/videocall' element={<VideoCallPage/>}/>
        <Route 
            path='/channel/:cid' 
            element={
                <Channel 
                    seteditcreatechanelbtn={seteditcreatechanelbtn} 
                    setvideouploadpage={setvideouploadpage}
                />
            }
        />
    </Routes>
  )
}

export default Allroutes


