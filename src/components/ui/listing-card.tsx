import Image from 'next/image'
import Link from 'next/link'
import { type Listing } from '@/lib/supabase'

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getConditionBadge = (condition?: string) => {
    if (!condition) return null
    
    const badgeStyles = {
      'new': 'bg-green-100 text-green-800',
      'like-new': 'bg-green-100 text-green-800', 
      'good': 'bg-blue-100 text-blue-800',
      'fair': 'bg-yellow-100 text-yellow-800',
      'poor': 'bg-red-100 text-red-800'
    }

    const normalizedCondition = condition.toLowerCase().replace(/\s+/g, '-')
    const badgeClass = badgeStyles[normalizedCondition as keyof typeof badgeStyles] || 'bg-gray-100 text-gray-800'

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>
        {condition}
      </span>
    )
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    }
  }

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={listing.image_url}
            alt={listing.title}
            fill
            className="object-cover transition-transform group-hover:scale-105 duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          />
          
          {/* Condition Badge - Overlay */}
          {listing.condition && (
            <div className="absolute top-2 left-2">
              {getConditionBadge(listing.condition)}
            </div>
          )}
          
          {/* Save Button - Top Right */}
          <button 
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              // Handle save functionality
            }}
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-3">
          {/* Price */}
          <div className="mb-1">
            <p className="text-lg font-bold text-gray-900">{formatPrice(listing.price)}</p>
          </div>

          {/* Title */}
          <div className="mb-2">
            <h3 className="text-sm text-gray-800 line-clamp-2 leading-tight font-medium">
              {listing.title}
            </h3>
          </div>

          {/* Location and Time */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">{listing.location || 'Palo Alto, CA'}</span>
            <span className="ml-2 flex-shrink-0">{formatTimeAgo(listing.created_at)}</span>
          </div>

          {/* Category */}
          {listing.category && (
            <div className="mt-1">
              <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                {listing.category}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
} 