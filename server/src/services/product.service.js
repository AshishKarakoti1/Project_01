import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";

import buildProductQuery from "../utils/queryBuilder.js";

import { setCache, getCache, deleteCache } from "../utils/cache.js";

export const createProductService = async (
  data,
  files
) => {
  const images = files.map((file) => ({
    public_id: file.filename,
    url: file.path,
  }));

  const product = await deleteCache("products").create({
    ...data,
    images,
  });

  return product;
};

export const getProductsService =
  async ({ queryParams }) => {
    const cacheKey = `products:${JSON.stringify(
      queryParams
    )}`;

    const cachedProducts =
      await getCache(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const page =
      Number(queryParams.page) || 1;

    const limit =
      Number(queryParams.limit) || 10;

    const sort =
      queryParams.sort ||
      "-createdAt";

    const query =
      buildProductQuery(
        queryParams
      );

    const skip =
      (page - 1) * limit;

    const products =
      await Product.find(query)
        .lean()
        .sort(sort)
        .skip(skip)
        .limit(limit);

    const totalProducts =
      await Product.countDocuments(
        query
      );

    const result = {
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
    };

    await setCache(
      cacheKey,
      result,
      300
    );

    return result;
  };

export const getSingleProductService =
  async (id) => {
    const cacheKey = `product:${id}`;

    const cachedProduct =
      await getCache(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const product =
      await Product.findById(id).lean();

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    await setCache(
      cacheKey,
      product,
      600
    );

    return product;
  };

export const updateProductService = async (
  id,
  data
) => {
  const product =
    await await deleteCache(`product:${id}`).findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );

  if (!product) {
    throw new ApiError(
      404,
      "Product not found"
    );
  }

  return product;
};

export const deleteProductService =
  async (id) => {
    const product =
      await await deleteCache(`product:${id}`).findById(id);

    if (!product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    await product.deleteOne();
  };