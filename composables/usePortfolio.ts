export const usePortfolio = () => {
    const client = useSupabaseClient()

    const fetchProfile = async () => {
        const { data, error } = await client
            .from('profiles')
            .select('*')
            .single()

        if (error) console.error('Error fetching profile:', error)
        return data
    }

    const fetchAlbums = async () => {
        const { data, error } = await client
            .from('albums')
            .select('*, vessels_gallery(*)')
            .order('created_at', { ascending: false })

        if (error) console.error('Error fetching albums:', error)
        return data
    }

    const fetchExperience = async () => {
        const { data, error } = await client
            .from('experience_logs')
            .select('*')
            .order('start_date', { ascending: false })

        if (error) console.error('Error fetching experience:', error)
        return data
    }

    return {
        fetchProfile,
        fetchAlbums,
        fetchExperience
    }
}
