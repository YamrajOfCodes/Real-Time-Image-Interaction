import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { fetchImages } from "../../lib/fetchImages";

const InfiniteScroll = () => {
    useInfiniteQuery({
        queryKey:["images",1],
        queryFn:fetchImages(1)
    })
  return (
    <div>
      
    </div>
  )
}

export default InfiniteScroll
