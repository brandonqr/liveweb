/**
 * EmptyState Data
 * Centralized data for EmptyState examples
 */
import { Rocket, BarChart3, FileText, Map, Image, DollarSign, MessageCircle, Users } from 'lucide-react'

/**
 * Get example prompts with translations
 * @param {Function} t - Translation function from useTranslation
 * @returns {Array} Array of example prompt objects
 */
export function getExamplePrompts(t) {
  return [
    {
      id: 'landing',
      prompt: t('components:emptyState.examples.landing'),
      icon: Rocket,
      category: t('components:emptyState.categories.web')
    },
    {
      id: 'dashboard',
      prompt: t('components:emptyState.examples.dashboard'),
      icon: BarChart3,
      category: t('components:emptyState.categories.data')
    },
    {
      id: 'form',
      prompt: t('components:emptyState.examples.form'),
      icon: FileText,
      category: t('components:emptyState.categories.forms')
    },
    {
      id: 'map',
      prompt: t('components:emptyState.examples.map'),
      icon: Map,
      category: t('components:emptyState.categories.maps')
    },
    {
      id: 'gallery',
      prompt: t('components:emptyState.examples.gallery'),
      icon: Image,
      category: t('components:emptyState.categories.media')
    },
    {
      id: 'pricing',
      prompt: t('components:emptyState.examples.pricing'),
      icon: DollarSign,
      category: t('components:emptyState.categories.business')
    },
    {
      id: 'chat',
      prompt: t('components:emptyState.examples.chat'),
      icon: MessageCircle,
      category: t('components:emptyState.categories.ai')
    },
    {
      id: 'reddit',
      prompt: t('components:emptyState.examples.reddit'),
      icon: Users,
      category: t('components:emptyState.categories.social')
    }
  ]
}
