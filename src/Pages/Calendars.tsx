// import React from 'react'
import Layouts from "@/Layout/Layout"
// import { Calendar } from "@/components/ui/calendar"
import Helps from "./Helps"

const Calendars = () => {
  return (
    <Layouts>
        {/* <div className="flex w-full "> */}
        <div className="w-full h-[100%] p-4">
          <Helps month={2} year={2025} />
        </div>
        {/* <div className="flex-1 p-4">
          chgwgwg
        </div> */}
      {/* </div> */}
    </Layouts>
  )
}

export default Calendars
