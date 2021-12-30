import '@testing-library/jest-dom';

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useLayoutEffect: jest.requireActual('react').useEffect,
}));

global.scrollTo = jest.fn();
