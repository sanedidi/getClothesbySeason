import { useQuery } from "react-query";

import httpRequestAuth from "./httpRequestAuth"

const bikeQueries = {
    getOrder: (data) => httpRequestAuth.post('bike/get-bike-order-using', data)
}

export const useGetBikeOrderUsingQuery = ({ data, querySettings}) => {
    return useQuery(
        ['BIKE_ORDER_USING_DATA', data],
        () => {
            return bikeQueries.getOrder(data)
        },
        querySettings
    )
}