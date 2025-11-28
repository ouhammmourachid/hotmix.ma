export default function SearchResultsLoading(){
    const skeletonItems = Array(3).fill(null);

    return (
      <div className="h-fit text-whity pt-4">
        <div className="flex items-center justify-between py-2">
          {/* Skeleton for title */}
          <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
          {/* Skeleton for "View all" link */}
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {skeletonItems.map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 py-2 border-b border-secondary">
            {/* Skeleton for product image */}
            <div className="w-16 h-16 bg-gray-700 rounded-sm animate-pulse"></div>

            <div className="flex flex-col gap-2 items-start">
              {/* Skeleton for product name */}
              <div className="h-5 w-32 bg-gray-700 rounded animate-pulse"></div>

              <div className="flex items-center gap-2">
                {/* Skeleton for price (50% chance to show "sale price" skeleton) */}
                {Math.random() > 0.5 && (
                  <div className="h-4 w-16 bg-gray-700 rounded animate-pulse"></div>
                )}
                {/* Skeleton for actual price */}
                <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>)
  }
