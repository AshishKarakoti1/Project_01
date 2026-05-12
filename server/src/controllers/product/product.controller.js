import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/apiResponse.js";
import parseFormData from "../../utils/parseFormData.js";

import {
  createProductService,
  getProductsService,
  getSingleProductService,
  updateProductService,
  deleteProductService,
} from "../../services/product.service.js";

export const createProduct =
  asyncHandler(async (req, res) => {
    const parsedBody =
      parseFormData(req.body);

    const product =
      await createProductService(
        parsedBody,
        req.files
      );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          "Product created successfully",
          product
        )
      );
  });

export const getProducts = asyncHandler(
  async (req, res) => {
    const products =
      await getProductsService({
        queryParams: req.query,
      });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Products fetched successfully",
          products
        )
      );
  }
);

export const getSingleProduct = asyncHandler(
  async (req, res) => {
    const product = await getSingleProductService(
      req.params.id
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Product fetched successfully",
          product
        )
      );
  }
);

export const updateProduct = asyncHandler(
  async (req, res) => {
    const product = await updateProductService(
      req.params.id,
      req.body
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Product updated successfully",
          product
        )
      );
  }
);

export const deleteProduct = asyncHandler(
  async (req, res) => {
    await deleteProductService(req.params.id);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Product deleted successfully"
        )
      );
  }
);