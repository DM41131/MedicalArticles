export const paginate = (query, { page = 1, limit = 10, sort = '-createdAt' }) => {
  const skip = (page - 1) * limit;
  
  return query
    .sort(sort)
    .skip(skip)
    .limit(limit);
};

export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort || '-createdAt';

  return { page, limit, sort };
};

export const createPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

