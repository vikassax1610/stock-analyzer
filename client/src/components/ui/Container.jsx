const Container = ({ children, className = '', maxWidth = 'max-w-7xl' }) => (
  <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

export default Container;
