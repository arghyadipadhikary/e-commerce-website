"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { collection, addDoc, query, where, orderBy, getDocs, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  productId: string
  rating: number
  comment: string
  createdAt: string
  helpful: number
  notHelpful: number
}

interface ProductReviewsProps {
  productId: string
  productName: string
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  })

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("productId", "==", productId),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(reviewsQuery)
      const reviewsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Review[]

      setReviews(reviewsData)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async () => {
    if (!user || !newReview.rating || !newReview.comment.trim()) return

    setSubmitting(true)
    try {
      const reviewData = {
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        productId,
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: new Date().toISOString(),
        helpful: 0,
        notHelpful: 0,
      }

      await addDoc(collection(db, "reviews"), reviewData)

      // Update product rating (you'd implement this in your product update logic)

      setNewReview({ rating: 0, comment: "" })
      setShowReviewForm(false)
      fetchReviews()
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleHelpfulVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) return

    try {
      const reviewRef = doc(db, "reviews", reviewId)
      await updateDoc(reviewRef, {
        [isHelpful ? "helpful" : "notHelpful"]: increment(1),
      })

      fetchReviews()
    } catch (error) {
      console.error("Error voting on review:", error)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {user && (
              <Button onClick={() => setShowReviewForm(!showReviewForm)} variant="outline">
                Write a Review
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className="text-gray-600">({reviews.length} reviews)</span>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length
              const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0

              return (
                <div key={rating} className="flex items-center space-x-2 text-sm">
                  <span className="w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="w-8 text-gray-600">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Review Form */}
      {showReviewForm && user && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review for {productName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Review</label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                rows={4}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleSubmitReview}
                disabled={submitting || !newReview.rating || !newReview.comment.trim()}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={review.userAvatar || "/placeholder.svg"} alt={review.userName} />
                    <AvatarFallback>
                      {review.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold">{review.userName}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-gray-700 mb-4">{review.comment}</p>

                    <div className="flex items-center space-x-4 text-sm">
                      <button
                        onClick={() => handleHelpfulVote(review.id, true)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                      <button
                        onClick={() => handleHelpfulVote(review.id, false)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Not Helpful ({review.notHelpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
