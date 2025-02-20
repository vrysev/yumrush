import ContentLoader from 'react-content-loader';
function SkeletonProduct(props) {
  return (
    <ContentLoader
      speed={2}
      width={620}
      height={260}
      viewBox="0 0 600 260"
      backgroundColor="#fafafa"
      foregroundColor="#ededed"
      {...props}
    >
      <circle cx="90" cy="141" r="85" />
      <rect x="209" y="76" rx="0" ry="0" width="363" height="20" />
      <rect x="208" y="122" rx="0" ry="0" width="183" height="20" />
      <rect x="209" y="158" rx="0" ry="0" width="183" height="20" />
      <rect x="432" y="190" rx="15" ry="15" width="138" height="30" />
      <rect x="210" y="191" rx="0" ry="0" width="62" height="30" />
    </ContentLoader>
  );
}

export default SkeletonProduct;
