import { NextResponse } from 'next/server'
import { getAllServices } from '@/lib/actions/services'

export async function GET() {
  try {
    const services = await getAllServices()
    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error in /api/services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}
