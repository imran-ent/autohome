const PageHeader = ({ title, subtitle, back = false }) => {
  return (
    <div className="mb-8">
      {back && (
        <Link to="-1" className="inline-flex items-center gap-2 text-blue text-sm font-medium hover:text-navy transition-colors mb-4">
          <ArrowLeft size={16} /> Back
        </Link>
      )}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-charcoal tracking-tight">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
