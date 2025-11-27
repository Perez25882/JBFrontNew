/**
 * API Service Layer
 * 
 * This file contains all API calls for the JoyBundle application.
 * Currently using mock data - replace with actual API endpoints when backend is ready.
 * 
 * API Integration Contract for Backend Developer:
 * 
 * Base URL: process.env.NEXT_PUBLIC_API_URL
 * 
 * Authentication:
 * - All authenticated endpoints require Bearer token in Authorization header
 * - Token is stored in localStorage/cookies after login
 * 
 * Response Format:
 * {
 *   success: boolean,
 *   data: any,
 *   message?: string,
 *   error?: string
 * }
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultHeaders = {
    "Content-Type": "application/json",
  }

  // Add auth token if available
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error)
    throw error
  }
}

// ============================================
// ORDER TRACKING API
// ============================================

/**
 * Track order by Order ID
 * GET /orders/track/:orderId
 */
export async function trackOrderById(orderId) {
  // Mock implementation - replace with actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock data
      const mockOrders = {
        "ORD-001": {
          id: "ORD-001",
          status: "delivered",
          statusHistory: [
            { status: "accepted", timestamp: "Oct 22, 2024 - 10:30 AM" },
            { status: "processing", timestamp: "Oct 22, 2024 - 10:35 AM" },
            { status: "delivered", timestamp: "Oct 22, 2024 - 12:45 PM" },
          ],
          date: "Oct 22, 2024 - 10:30 AM",
          bundle: "5GB MTN Data Bundle",
          phone: "0245550101",
          amount: 60.0,
          network: "MTN",
        },
      }

      const order = mockOrders[orderId.toUpperCase()]
      if (order) {
        resolve({ success: true, data: order })
      } else {
        reject(new Error("Order not found"))
      }
    }, 1500)
  })
}

/**
 * Track orders by phone number
 * GET /orders/track/phone/:phoneNumber
 */
export async function trackOrderByPhone(phoneNumber) {
  // Mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: "ORD-001",
            status: "delivered",
            bundle: "5GB MTN Data Bundle",
            amount: 60.0,
            date: "Oct 22, 2024",
          },
        ],
      })
    }, 1500)
  })
}

// ============================================
// SUPPORT TICKET API
// ============================================

/**
 * Get orders by phone number for ticket creation
 * GET /support/orders/:phoneNumber
 */
export async function getOrdersByPhone(phoneNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          { id: "ORD-001", date: "Oct 22, 2024", bundle: "5GB MTN Data Bundle", status: "delivered", amount: 60.0 },
          { id: "ORD-002", date: "Oct 23, 2024", bundle: "10GB Telecel Data Bundle", status: "processing", amount: 100.0 },
        ],
      })
    }, 1000)
  })
}

/**
 * Submit support ticket
 * POST /support/tickets
 * Body: { phoneNumber, orderId, message }
 */
export async function submitTicket(ticketData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          ticketId: `TKT-${Math.floor(10000 + Math.random() * 90000)}`,
          status: "open",
          createdAt: new Date().toISOString(),
        },
      })
    }, 2000)
  })
}

/**
 * Get ticket history for a phone number
 * GET /support/tickets/:phoneNumber
 */
export async function getTicketHistory(phoneNumber) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [],
      })
    }, 1000)
  })
}

// ============================================
// ADMIN API
// ============================================

/**
 * Get all tickets (Admin)
 * GET /admin/tickets
 */
export async function getAdminTickets(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [],
      })
    }, 1000)
  })
}

/**
 * Reply to ticket (Admin)
 * POST /admin/tickets/:ticketId/reply
 * Body: { message }
 */
export async function replyToTicket(ticketId, message) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          messageId: Date.now(),
          ticketId,
          message,
          sender: "admin",
          timestamp: new Date().toISOString(),
        },
      })
    }, 1000)
  })
}

/**
 * Get all orders (Admin)
 * GET /admin/orders
 * Query: { network, status, startDate, endDate, page, limit }
 */
export async function getAdminOrders(filters = {}) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
        },
      })
    }, 1000)
  })
}

/**
 * Update order status (Admin)
 * PATCH /admin/orders/:orderId/status
 * Body: { status }
 */
export async function updateOrderStatus(orderId, status) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { orderId, status },
      })
    }, 500)
  })
}

// ============================================
// RESELLER API
// ============================================

/**
 * Get reseller dashboard stats
 * GET /reseller/dashboard
 */
export async function getResellerDashboard() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          totalEarnings: 1250.0,
          totalOrders: 86,
          commissionRate: 5,
          tier: "Silver",
        },
      })
    }, 1000)
  })
}

/**
 * Get bundle pricing options
 * GET /reseller/bundles/pricing
 */
export async function getBundlePricing() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            bundleId: "mtn-5gb",
            name: "5GB MTN Data Bundle",
            costPrice: 50.0,
            suggestedPrice1: 55.0,
            suggestedPrice2: 60.0,
            recommendedPrice: 58.0,
          },
        ],
      })
    }, 1000)
  })
}

/**
 * Update bundle price
 * PATCH /reseller/bundles/:bundleId/price
 * Body: { price }
 */
export async function updateBundlePrice(bundleId, price) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { bundleId, price },
      })
    }, 1000)
  })
}

/**
 * Request payout
 * POST /reseller/payouts
 * Body: { network, phoneNumber, amount, password }
 */
export async function requestPayout(payoutData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Validate password (mock)
      if (payoutData.password === "wrong") {
        reject(new Error("Invalid password"))
        return
      }

      resolve({
        success: true,
        data: {
          payoutId: `PAY-${Date.now()}`,
          amount: payoutData.amount,
          network: payoutData.network,
          phoneNumber: payoutData.phoneNumber,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      })
    }, 2000)
  })
}

// ============================================
// AUTH API
// ============================================

/**
 * Login
 * POST /auth/login
 * Body: { email, password }
 */
export async function login(credentials) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        resolve({
          success: true,
          data: {
            token: "mock_token_123",
            user: {
              id: "user_1",
              email: credentials.email,
              role: "reseller",
            },
          },
        })
      } else {
        reject(new Error("Invalid credentials"))
      }
    }, 1000)
  })
}

/**
 * Register
 * POST /auth/register
 * Body: { firstName, lastName, email, phone, password }
 */
export async function register(userData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          userId: `user_${Date.now()}`,
          email: userData.email,
        },
      })
    }, 1500)
  })
}

/**
 * Logout
 * POST /auth/logout
 */
export async function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
  return { success: true }
}

// Export all API functions
export const api = {
  // Order tracking
  trackOrderById,
  trackOrderByPhone,
  
  // Support
  getOrdersByPhone,
  submitTicket,
  getTicketHistory,
  
  // Admin
  getAdminTickets,
  replyToTicket,
  getAdminOrders,
  updateOrderStatus,
  
  // Reseller
  getResellerDashboard,
  getBundlePricing,
  updateBundlePrice,
  requestPayout,
  
  // Auth
  login,
  register,
  logout,
}
