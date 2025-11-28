import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-[120px] font-light leading-none mb-8">
        404
      </h1>

      <h2 className="text-3xl md:text-4xl font-medium mb-4">
        Oops...That link is broken.
      </h2>

      <p className="text-gray-300 text-center max-w-xl mb-8">
        Sorry for the inconvenience. Go to our homepage to check out our latest collections.
      </p>

      <Link
        href="/"
        className="px-8 py-3 bg-secondary hover:bg-secondary/70 transition-colors border border-greny rounded-sm font-medium"
      >
        Shop now
      </Link>
    </div>
  );
};

export default NotFound;
