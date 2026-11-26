import React from "react"
import { Plus, Heart } from "lucide-react"
import { formatCOP } from "../../helpers/formatters"
import styles from "./CardItem.module.css"

export interface CardItemProps {
  id: string
  title: string
  price: number
  image: string
  category?: string
  badge?: string
  onAddToCart?: () => void
}

export const CardItem: React.FC<CardItemProps> = ({
  title,
  price,
  image,
  badge,
  onAddToCart,
}) => {
  return (
    <div className={styles.card}>
      <div className="relative h-48 w-full overflow-hidden bg-gray-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
        {badge && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-semibold px-2.5 py-1 rounded-full text-gray-800">
            {badge}
          </span>
        )}
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-red-500 transition-colors">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 flex flex-col justify-between">
        <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-base font-bold text-gray-900">
            {formatCOP(price)}
          </span>
          <button
            onClick={onAddToCart}
            className="flex items-center gap-1 bg-[#e0533c] hover:bg-[#c8432d] text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Añadir
          </button>
        </div>
      </div>
    </div>
  )
}
