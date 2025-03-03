import ContentLoader from 'react-content-loader';

const SkeletonProduct = (props) => {
  return (
    <div className="product product--skeleton">
      <ContentLoader
        speed={2}
        width={350}
        height={160}
        viewBox="0 0 350 160"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
        {...props}
      >
        <circle cx="80" cy="80" r="60" />
        <rect x="160" y="30" rx="4" ry="4" width="150" height="20" />
        <rect x="160" y="70" rx="3" ry="3" width="100" height="15" />
        <rect x="160" y="110" rx="3" ry="3" width="70" height="20" />
        <rect x="245" y="110" rx="8" ry="8" width="80" height="25" />
      </ContentLoader>
    </div>
  );
};

export default SkeletonProduct;
