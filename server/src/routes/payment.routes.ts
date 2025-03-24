import { Router } from 'express'
import {
  createPaymentController,
  getPaymentHistoryController,
  getPaymentStatusController,
  getPricingInfoController,
  getSubscriptionStatusController,
  paymentCallbackController,
  paymentWebhookController
} from '~/controllers/payments.controllers'
import { AccessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'

const paymentRouter = Router()

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Create a new payment
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_type:
 *                 type: number
 *                 description: The type of subscription (1 for PREMIUM, 2 for PLATINUM)
 *     responses:
 *       200:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 payUrl:
 *                   type: string
 *                   description: URL for payment gateway
 *                 orderId:
 *                   type: string
 *                   description: Order ID for the payment
 *       400:
 *         description: Invalid subscription type
 */
paymentRouter.post('/', AccessTokenValidator, verifiedUserValidator, wrapAsync(createPaymentController))

/**
 * @swagger
 * /payments/callback:
 *   get:
 *     summary: VNPAY callback after payment
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Transaction reference from VNPAY
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: Response code from VNPAY
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Secure hash from VNPAY
 *     responses:
 *       302:
 *         description: Redirects to payment result page
 */
paymentRouter.get('/callback', wrapAsync(paymentCallbackController))

/**
 * @swagger
 * /payments/webhook:
 *   get:
 *     summary: Payment webhook from VNPAY
 *     tags:
 *       - Payments
 *     parameters:
 *       - in: query
 *         name: vnp_TxnRef
 *         schema:
 *           type: string
 *         description: Transaction reference from VNPAY
 *       - in: query
 *         name: vnp_ResponseCode
 *         schema:
 *           type: string
 *         description: Response code from VNPAY
 *       - in: query
 *         name: vnp_SecureHash
 *         schema:
 *           type: string
 *         description: Secure hash from VNPAY
 *     responses:
 *       200:
 *         description: Webhook processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 RspCode:
 *                   type: string
 *                 Message:
 *                   type: string
 */
paymentRouter.get('/webhook', wrapAsync(paymentWebhookController))

/**
 * @swagger
 * /payments/{order_id}:
 *   get:
 *     summary: Get payment status by order_id
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Order ID of the payment
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 orderId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 subscriptionType:
 *                   type: number
 *                 bankCode:
 *                   type: string
 *                 cardType:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Payment not found
 */
paymentRouter.get('/:order_id', AccessTokenValidator, verifiedUserValidator, wrapAsync(getPaymentStatusController))

/**
 * @swagger
 * /payments/subscription/status:
 *   get:
 *     summary: Get current user subscription status
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isActive:
 *                   type: boolean
 *                 subscriptionType:
 *                   type: string
 *                   enum: [FREE, PREMIUM, PLATINUM]
 *                 expiryDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 */
paymentRouter.get(
  '/subscription/status',
  AccessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getSubscriptionStatusController)
)

/**
 * @swagger
 * /payments/pricing:
 *   get:
 *     summary: Get pricing information
 *     tags:
 *       - Payments
 *     responses:
 *       200:
 *         description: Pricing information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 prices:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 *                 duration:
 *                   type: object
 *                   additionalProperties:
 *                     type: number
 */
paymentRouter.get('/pricing', wrapAsync(getPricingInfoController))

/**
 * @swagger
 * /payments/history:
 *   get:
 *     summary: Get payment history
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       orderId:
 *                         type: string
 *                       transactionId:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       subscriptionType:
 *                         type: string
 *                       status:
 *                         type: string
 *                       bankCode:
 *                         type: string
 *                       cardType:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 */
paymentRouter.get('/history', AccessTokenValidator, verifiedUserValidator, wrapAsync(getPaymentHistoryController))

export default paymentRouter
