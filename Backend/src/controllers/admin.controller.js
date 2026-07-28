import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import Order from "../models/order.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments(),

      Product.countDocuments({ isActive: true }),

      Category.countDocuments({ isActive: true }),

      Order.countDocuments(),

      Order.countDocuments({ orderStatus: "pending" }),

      Order.countDocuments({ orderStatus: "confirmed" }),

      Order.countDocuments({ orderStatus: "shipped" }),

      Order.countDocuments({ orderStatus: "delivered" }),

      Order.countDocuments({ orderStatus: "cancelled" }),

      Product.countDocuments({
        isActive: true,
        stock: { $lte: 5 },
      }),

      Order.aggregate([
        {
          $match: {
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        lowStockProducts,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    return res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      data: recentOrders,
    });
  } catch (error) {
    console.error("Get Recent Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      isActive: true,
      stock: { $lte: 5 },
    })
      .populate("category", "name")
      .sort({ stock: 1 });

    return res.status(200).json({
      success: true,
      message: "Low stock products fetched successfully",
      data: lowStockProducts,
    });
  } catch (error) {
    console.error("Get Low Stock Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSalesAnalytics = async (req, res) => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalRevenue: {
            $sum: "$totalAmount",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Sales analytics fetched successfully",
      data: {
        monthlySales,
      },
    });
  } catch (error) {
    console.error("Get Sales Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build match stage dynamically
    const matchStage = {
      paymentStatus: "paid",
      orderStatus: { $in: ["delivered", "shipped"] },
    };

    // Optional date filter
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const topProducts = await Order.aggregate([
      {
        $match: matchStage,
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items.product",
          totalSold: {
            $sum: "$items.quantity",
          },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },

      // Sort before lookup (Performance Improvement)
      {
        $sort: {
          totalSold: -1,
        },
      },

      // Limit before lookup (Performance Improvement)
      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      // Keep products even if deleted
      {
        $unwind: {
          path: "$productDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,

          productId: "$_id",

          productName: {
            $ifNull: ["$productDetails.name", "Deleted Product"],
          },

          productImage: {
            $ifNull: [
              {
                $arrayElemAt: ["$productDetails.images", 0],
              },
              null,
            ],
          },

          stock: {
            $ifNull: ["$productDetails.stock", 0],
          },

          totalSold: 1,

          totalRevenue: {
            $round: ["$totalRevenue", 2], // optional
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Top selling products fetched successfully",
      count: topProducts.length,
      data: topProducts,
    });
  } catch (error) {
    console.error("Get Top Selling Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTopSellingCategories = async (req, res) => {
  try {
    const topCategories = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          orderStatus: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $unwind: "$categoryDetails",
      },
      {
        $group: {
          _id: "$categoryDetails._id",
          categoryName: { $first: "$categoryDetails.name" },
          totalSold: {
            $sum: "$items.quantity",
          },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          categoryName: 1,
          totalSold: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Top selling categories fetched successfully",
      data: topCategories,
    });
  } catch (error) {
    console.error("Get Top Selling Categories Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getTopCustomers = async (req, res) => {
  try {
    const topCustomers = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          orderStatus: { $in: ["delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: "$user",
          totalOrders: {
            $sum: 1,
          },
          totalSpent: {
            $sum: "$totalAmount",
          },
          averageOrderValue: {
            $avg: "$totalAmount",
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$userDetails.name",
          email: "$userDetails.email",
          totalOrders: 1,
          totalSpent: 1,
          averageOrderValue: {
            $round: ["$averageOrderValue", 2],
          },
        },
      },
      {
        $sort: {
          totalSpent: -1,
        },
      },
      {
        $limit: 10,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Top customers fetched successfully",
      data: topCustomers,
    });
  } catch (error) {
    console.error("Get Top Customers Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getOrderStatusAnalytics = async (req, res) => {
  try {
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // Create a map for easy lookup and ensure all statuses are represented
    const statusMap = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    statusCounts.forEach((item) => {
      if (statusMap.hasOwnProperty(item.status)) {
        statusMap[item.status] = item.count;
      }
    });

    const formattedData = Object.keys(statusMap).map((status) => ({
      status,
      count: statusMap[status],
    }));

    return res.status(200).json({
      success: true,
      message: "Order status analytics fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error("Get Order Status Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getRevenueOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const revenueData = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $facet: {
          today: [
            {
              $match: {
                createdAt: { $gte: startOfDay },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
          ],
          thisWeek: [
            {
              $match: {
                createdAt: { $gte: startOfWeek },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
          ],
          thisMonth: [
            {
              $match: {
                createdAt: { $gte: startOfMonth },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
          ],
          thisYear: [
            {
              $match: {
                createdAt: { $gte: startOfYear },
              },
            },
            {
              $group: {
                _id: null,
                revenue: { $sum: "$totalAmount" },
                orders: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          today: { $arrayElemAt: ["$today", 0] },
          thisWeek: { $arrayElemAt: ["$thisWeek", 0] },
          thisMonth: { $arrayElemAt: ["$thisMonth", 0] },
          thisYear: { $arrayElemAt: ["$thisYear", 0] },
        },
      },
      {
        $project: {
          today: {
            revenue: { $ifNull: ["$today.revenue", 0] },
            orders: { $ifNull: ["$today.orders", 0] },
          },
          thisWeek: {
            revenue: { $ifNull: ["$thisWeek.revenue", 0] },
            orders: { $ifNull: ["$thisWeek.orders", 0] },
          },
          thisMonth: {
            revenue: { $ifNull: ["$thisMonth.revenue", 0] },
            orders: { $ifNull: ["$thisMonth.orders", 0] },
          },
          thisYear: {
            revenue: { $ifNull: ["$thisYear.revenue", 0] },
            orders: { $ifNull: ["$thisYear.orders", 0] },
          },
        },
      },
    ]);

    const result = revenueData[0] || {
      today: { revenue: 0, orders: 0 },
      thisWeek: { revenue: 0, orders: 0 },
      thisMonth: { revenue: 0, orders: 0 },
      thisYear: { revenue: 0, orders: 0 },
    };

    return res.status(200).json({
      success: true,
      message: "Revenue overview fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("Get Revenue Overview Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
