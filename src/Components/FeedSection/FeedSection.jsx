import React from 'react'

const FeedSection = React.memo(({letestUpdate,activity,barColor})=>{
    console.log("rerender")
 return (
   <section
        className={`transition-all duration-300 border-b ${letestUpdate !== null
            ? `bg-${barColor}-50 border-${barColor}-200`
            : 'bg-gray-50 border-gray-200'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14">
            <div className="flex items-center justify-center gap-3">
              {activity ? (
                <>
                  <div className={`w-1 h-6 sm:h-8 ${barColor}`} />
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {activity.data.userName}
                    </span>{" "}
                    {activity.type === "reaction"
                      ? `reacted ${activity.data.emojis}`
                      : "commented"}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">No recent activity</p>
              )}


            </div>
          </div>
        </div>
      </section>
  )
}) 
 


export default FeedSection
