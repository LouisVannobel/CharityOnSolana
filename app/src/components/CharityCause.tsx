import { FC } from 'react';

interface CharityCauseProps {
  className?: string;
}

export const CharityCause: FC<CharityCauseProps> = ({ className = '' }) => {
  return (
    <div className={`content-section overflow-hidden ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
        <div className="md:w-1/2 mb-6 md:mb-0">
          <div className="relative">
            {/* Main image with shadow and border */}
            <div className="rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80" 
                alt="Animal Shelter" 
                className="w-full h-64 md:h-80 object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-lg overflow-hidden border-4 border-white shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1143&q=80" 
                alt="Cat" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                alt="Dog" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <div className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-3">Our Mission</div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Helping Abandoned Animals</h2>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            Our platform is dedicated to raising funds for animal shelters that provide care, 
            medical treatment, and loving homes for abandoned and mistreated animals.
          </p>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Every NFT purchase directly contributes to these shelters, helping them continue 
            their vital work in rescuing and rehabilitating animals in need.
          </p>
          
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-100">
            <h4 className="font-semibold text-gray-800 mb-3">How Your Donation Helps</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Provides food and shelter for abandoned animals
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Funds medical treatments and vaccinations
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Supports spay/neuter programs
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Helps with adoption and rehoming initiatives
              </li>
              <li className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Enables educational programs about animal welfare
              </li>
            </ul>
          </div>
          
          <div className="mt-6">
            <button 
              onClick={() => window.dispatchEvent(new Event('navigate-to-nft-gallery'))} 
              className="btn-primary inline-flex items-center"
            >
              Browse NFT Collection
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityCause;
