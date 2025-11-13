import { useState } from 'react'

interface PriceButtonProps {
  price: number;
  isForSale: boolean;
  isPurchased?: boolean;
  onPurchase?: () => void;
  onViewPurchased?: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showOriginalPrice?: boolean;
  originalPrice?: number;
  discount?: number;
}

const PriceButton: React.FC<PriceButtonProps> = ({
  price,
  isForSale,
  isPurchased = false,
  onPurchase,
  onViewPurchased,
  className = '',
  size = 'medium',
  showOriginalPrice = false,
  originalPrice,
  discount
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isPurchased) {
      onViewPurchased?.()
    } else if (isForSale) {
      setIsLoading(true)
      try {
        await onPurchase?.()
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'btn-small'
      case 'large': return 'btn-large'
      default: return ''
    }
  }

  if (!isForSale) {
    return (
      <div className={`price-button-container ${className}`}>
        <span className="free-recipe-badge">Free Recipe</span>
      </div>
    )
  }

  return (
    <div className={`price-button-container ${className}`}>
      <div className="price-display">
        {showOriginalPrice && originalPrice && (
          <span className="original-price">{formatPrice(originalPrice)}</span>
        )}
        <span className={`current-price ${size === 'large' ? 'large' : size === 'small' ? 'small' : ''}`}>
          {formatPrice(price)}
        </span>
        {discount && (
          <span className="discount-badge">-{discount}%</span>
        )}
      </div>

      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`btn ${getSizeClass()} ${isPurchased ? 'btn-outline' : 'btn-primary'}`}
      >
        {isLoading ? (
          <>
            <div className="loading-spinner small"></div>
            Processing...
          </>
        ) : isPurchased ? (
          <>
            <i className="fas fa-eye"></i>
            View Recipe
          </>
        ) : (
          <>
            <i className="fas fa-shopping-cart"></i>
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}

export default PriceButton
