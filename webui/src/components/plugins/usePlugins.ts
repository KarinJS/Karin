import { useState, useMemo } from 'react'
import { mockPlugins } from '../../mocks/plugins'
import type { Plugin } from '../../types/plugin'

export const usePlugins = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null)

  const rowsPerPage = 12

  // Filter logic
  const filteredPlugins = useMemo(() => {
    return mockPlugins.filter(plugin => {
      // Search filter
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            plugin.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Category/Tag filter
      let matchesFilter = true
      if (activeFilter === 'all') matchesFilter = true
      else if (activeFilter === 'installed') matchesFilter = plugin.installed
      else if (activeFilter === 'npm') matchesFilter = plugin.type === 'npm'
      else if (activeFilter === 'url') matchesFilter = plugin.type === 'url'
      else matchesFilter = plugin.tags?.includes(activeFilter) || false

      return matchesSearch && matchesFilter
    })
  }, [searchQuery, activeFilter])

  const paginatedPlugins = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    return filteredPlugins.slice(start, start + rowsPerPage)
  }, [page, filteredPlugins])

  const setFilterWithReset = (filter: string) => {
    setActiveFilter(filter)
    setPage(1)
  }

  const setSearchWithReset = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  return {
    activeFilter,
    setActiveFilter: setFilterWithReset,
    searchQuery,
    setSearchQuery: setSearchWithReset,
    page,
    setPage,
    selectedPlugin,
    setSelectedPlugin,
    filteredPlugins,
    paginatedPlugins,
    rowsPerPage
  }
}
