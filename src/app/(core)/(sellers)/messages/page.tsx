import DataTable from '@/components/core/data-table'
import { Text } from '@mantine/core'
import React from 'react'

interface Messages{
    

}

const messageData: Messages[]=[
    {}
]

const Page = () => {
  return (
    <>
    <Text fw={700}>Messages</Text>
    {/* <DataTable 
      data={[]} 
      columns={[]} 
      getRowId={(row: { id: string }) => row.id} 
    /> */}
    </>
  )
}

export default Page