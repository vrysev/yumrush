import ContentLoader from 'react-content-loader';

const SkeletonProduct = (props) => {
  return (
    <div className="product product--skeleton">
        <ContentLoader 
    speed={1}
    width={300}
    height={437}
    viewBox="0 0 300 437"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="142" cy="164" r="116" /> 
    <rect x="35" y="322" rx="0" ry="0" width="224" height="18" /> 
    <rect x="35" y="348" rx="0" ry="0" width="132" height="11" /> 
    <rect x="35" y="375" rx="0" ry="0" width="63" height="15" /> 
    <rect x="193" y="365" rx="0" ry="0" width="63" height="27" />
  </ContentLoader>
    </div>
  );
};

export default SkeletonProduct;
