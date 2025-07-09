// ElevatorUI.tsx
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const NUM_FLOORS = 10;

interface Elevator {
	id: number;
	currentFloor: number;
	direction: 'up' | 'down' | '-';
	isMoving: boolean;
	doorOpen: boolean;
	targets: number[];
}

export default function ElevatorUI() {
	const [elevators, setElevators] = useState<Elevator[]>([]);
	const [elevatorAssigned, setElevetorAssigned] = useState<number>();

	useEffect(() => {
		socket.on('elevator-state', (data) => {
			setElevators(data);
		});
		socket.on('elevator-assigned', (data) => {
			setElevetorAssigned(data.elevatorId);
			const id = setTimeout(() => {
				setElevetorAssigned(undefined);
				clearTimeout(id);
			}, 3000);
		});

		return () => {
			socket.off('elevator-state');
			socket.off('elevator-assigned');
		};
	}, []);

	const callElevator = (floor: number, direction: 'up' | 'down') => {
		socket.emit('call-elevator', { floor, direction });
	};

	const openDoor = (id: number) =>
		socket.emit('open-door', { elevatorId: id });

	const closeDoor = (id: number) =>
		socket.emit('close-door', { elevatorId: id });

	const selectFloor = (id: number, floor: number) => {
		socket.emit('select-floor', { elevatorId: id, floor });
		setElevators((pre) => {
			return pre.map((item) =>
				item.id === id
					? { ...item, targets: [...(item.targets ?? []), floor] }
					: item
			);
		});
	};

	const isActiveTargets = (
		elevator: Elevator,
		floorNumber: number
	): boolean => {
		const { targets } = elevator;
		if (targets.includes(floorNumber)) {
			return true;
		}
		return false;
	};

	return (
		<div className="p-4 space-y-6 min-h-screen">
			<h1 className="text-3xl font-extrabold text-indigo-700 mb-6 drop-shadow-lg flex items-center gap-2 justify-center">
				Elevator Simulation
			</h1>
			<div className="grid grid-cols-4 gap-6 p-4 bg-white bg-opacity-80 rounded-2xl shadow-2xl">
				<div className="col-span-1 space-y-2">
					{[...Array(NUM_FLOORS)].map((_, floorIndex) => {
						const floor = NUM_FLOORS - floorIndex;
						return (
							<div
								key={floor}
								className="rounded-xl shadow flex justify-between items-center px-4 py-2 bg-gradient-to-r from-indigo-50 to-white border border-indigo-100"
							>
								<div className="font-bold text-lg text-indigo-800">
									Floor {floor}
								</div>
								<div className="flex gap-2 mt-1">
									{floor < NUM_FLOORS && (
										<button
											onClick={() =>
												callElevator(floor, 'up')
											}
											className="cursor-pointer bg-green-100 hover:bg-green-300 text-green-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition"
											title="Call Up"
										>
											▲
										</button>
									)}
									{floor > 1 && (
										<button
											onClick={() =>
												callElevator(floor, 'down')
											}
											className="cursor-pointer bg-pink-100 hover:bg-pink-300 text-pink-700 rounded-full w-8 h-8 flex items-center justify-center shadow transition"
											title="Call Down"
										>
											▼
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{elevators.map((el: Elevator) => (
						<div
							key={el.id}
							className={`rounded-2xl shadow-2xl p-6 bg-white border-4 transition-all duration-300 ${
								el.isMoving
									? 'border-green-400'
									: 'border-gray-200'
							} ${el.doorOpen ? 'ring-4 ring-yellow-300' : ''}`}
						>
							<div className="font-bold mb-2 text-xl text-indigo-700 flex items-center gap-2">
								<span role="img" aria-label="elevator">
									🛗
								</span>{' '}
								Elevator #{el.id}
							</div>
							{elevatorAssigned === el.id && (
								<div className="text-center gap-2 bg-green-500 bg-opacity-90 rounded-xl  py-2 text-white font-semibold shadow-lg animate-pulse  border-green-700">
									Elevator {elevatorAssigned} assigned
								</div>
							)}
							<div className="mb-1 text-lg">
								Current Floor:{' '}
								<span className="font-semibold text-indigo-900">
									{el.currentFloor}
								</span>
							</div>
							<div className="mb-1">
								Status:{' '}
								<span
									className={`font-semibold ${
										el.isMoving
											? 'text-green-600'
											: 'text-gray-500'
									}`}
								>
									{el.isMoving ? 'Moving' : 'Stopped'}
								</span>
							</div>
							<div className="mb-1">
								Door:{' '}
								<span
									className={`font-bold ${
										el.doorOpen
											? 'text-green-500'
											: 'text-red-500 '
									}`}
								>
									{el.doorOpen ? 'OPEN' : 'CLOSED'}
								</span>
							</div>
							<div className="flex flex-wrap gap-2 mt-3 justify-center">
								{[...Array(NUM_FLOORS)].map((_, i) => (
									<button
										key={i + 1}
										className={`cursor-pointer rounded-full w-10 h-10 flex items-center justify-center border-2 text-lg font-bold transition shadow ${
											el.currentFloor === i + 1 ||
											isActiveTargets(el, i + 1)
												? 'bg-indigo-200 border-indigo-500 text-indigo-900'
												: 'bg-gray-50 border-gray-200 hover:bg-indigo-100 hover:border-indigo-400'
										}
                    
                    `}
										onClick={() =>
											selectFloor(el.id, i + 1)
										}
										title={`Select Floor ${i + 1}`}
									>
										{i + 1}
									</button>
								))}
							</div>
							<div className="mt-4 flex gap-4 justify-center">
								<button
									className="cursor-pointer bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-1 transition"
									onClick={() => openDoor(el.id)}
									title="Open Door"
								>
									Open Door
								</button>
								<button
									className="cursor-pointer bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow flex items-center gap-1 transition"
									onClick={() => closeDoor(el.id)}
									title="Close Door"
								>
									Close Door
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
