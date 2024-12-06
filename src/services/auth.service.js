import { useMutation } from 'react-query';
import httpRequestAuth from './httpRequestAuth';

const authService = {
	getSeason: (data) => httpRequestAuth.post('get-list/season', data),
	getClothes: (data) => httpRequestAuth.post('get-list/clothes', data)
};

export const useSeasonMutation = (mutationSettings) => {
	return useMutation((data) => authService.getSeason(data), mutationSettings);
};

export const useClothesMutation = (mutationSettings) => {
	return useMutation((data) => authService.getClothes(data), mutationSettings)
}
