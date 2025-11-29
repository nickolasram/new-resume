const ShrinkingHeader=()=>(
    <div className="w-full bg-gray-950  p-6 group">
        <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-4xl md:text-5xl text-white">Nick Ramirez &middot; Web Dev</p>
            <div  className="text-gray-500 text-4xl flex gap-5 hoverIndicator items-center">
                <p> hover to expand</p>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor" 
                    className="size-8"
                    >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
                </svg>
            </div>
        </div>
        <p className="text-xl headerDescription text-center px-[10%] group-hover:mt-6 group-hover:h-36 group-hover:opacity-100 md:group-hover:h-12 group-hover:visible transition-all">North Seattle College, BAS in Application Development. 
            Thank you for visiting this site where you&apos;ll find information about my background, projects, and goals as a developer.</p>
    </div>
)

export default ShrinkingHeader