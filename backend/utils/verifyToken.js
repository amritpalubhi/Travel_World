import jwt from 'jsonwebtoken'

const baseVerify = (req, res, next) => {
  let token = req.cookies?.accessToken

  // If no cookie, try Authorization header: Bearer <token>
  if (!token) {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1]
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "You are not authenticated" })
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: "Token is invalid" })
    }
    req.user = user
    next()
  })
}

export const verifyToken = baseVerify

export const verifyUser = (req, res, next) => {
  baseVerify(req, res, () => {
    if (
      req.user.role === 'admin' ||
      !req.params.id ||
      req.user.id === req.params.id
    ) {
      next()
    } else {
      return res.status(401).json({ success: false, message: "You are not authenticated" })
    }
  })
}

export const verifyAdmin = (req, res, next) => {
  baseVerify(req, res, () => {
    if (req.user.role === 'admin') {
      next()
    } else {
      return res.status(401).json({ success: false, message: "You are not authorized" })
    }
  })
}