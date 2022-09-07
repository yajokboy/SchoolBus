//For check access TOKEN from header
import Koa, { Context } from 'koa'
import HttpStatusCode from '../enums/httpStatusCode'

export async function authorize(ctx: Context, next: Koa.Next) {
  const _auth = ctx.headers.Authorization || ctx.headers.authorization
  try {
    if (typeof _auth == 'string') {
      const _authSplit = _auth.split(' ')[1]
      if (_authSplit == 'SchoolBusToken2022') ctx.status = HttpStatusCode.OK
      await next()
    } else {
      ctx.status = HttpStatusCode.UNAUTHORIZED
      return
    }
  } catch (e) {
    ctx.status = HttpStatusCode.UNAUTHORIZED
    return
  }
}
