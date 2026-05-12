const buildProductQuery = (queryParams) => {
  const query = {};

  if (queryParams.category) {
    query.category = queryParams.category;
  }

  if (queryParams.material) {
    query.material = queryParams.material;
  }

  if (queryParams.featured) {
    query.featured =
      queryParams.featured === "true";
  }

  if (queryParams.minPrice || queryParams.maxPrice) {
    query.price = {};

    if (queryParams.minPrice) {
      query.price.$gte = Number(
        queryParams.minPrice
      );
    }

    if (queryParams.maxPrice) {
      query.price.$lte = Number(
        queryParams.maxPrice
      );
    }
  }

  if (queryParams.rating) {
    query.ratings = {
      $gte: Number(queryParams.rating),
    };
  }

  if (queryParams.inStock === "true") {
    query.stock = {
      $gt: 0,
    };
  }

  if (queryParams.search) {
    query.$text = {
      $search: queryParams.search,
    };
  }

  return query;
};

export default buildProductQuery;