import { getAuthSession } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import React from 'react'

const HistoryPage = async () => {
    const session = await getAuthSession();
    if(!session?.user) {
        redirect('/');
    }
    
    return (
        <div>
            History
        </div>
    )
}

export default HistoryPage;