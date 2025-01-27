import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-123';

// Korunacak sayfalar
const protectedRoutes = ['/dashboard'];
// Giriş yapmış kullanıcının erişemeyeceği sayfalar
const authRoutes = ['/login'];

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Ana sayfadan login'e yönlendir
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // LocalStorage'dan user bilgisini al
  const user = request.cookies.get('user')?.value;

  // Dashboard erişimi kontrolü
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Login sayfası kontrolü
  if (path === '/login') {
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
}; 