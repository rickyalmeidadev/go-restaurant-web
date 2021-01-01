import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data } = await api.get('/foods');
      setFoods(data);
    };

    fetchData();
  }, []);

  const handleAddFood = async (
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> => {
    const { data } = await api.post('/foods', {
      ...food,
      available: true,
    });

    setFoods(prevState => [...prevState, data]);
  };

  const handleUpdateFood = async (
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> => {
    const { data } = await api.put(`/foods/${editingFood.id}`, {
      ...editingFood,
      ...food,
    });

    setFoods(prevState =>
      prevState.map(eachFood =>
        eachFood.id === editingFood.id ? data : eachFood,
      ),
    );
  };

  const handleDeleteFood = async (id: number): Promise<void> => {
    await api.delete(`/foods/${id}`);

    setFoods(prevState => prevState.filter(food => food.id !== id));
  };

  const toggleModal = (): void => {
    setModalOpen(!modalOpen);
  };

  const toggleEditModal = (): void => {
    setEditModalOpen(!editModalOpen);
  };

  const handleEditFood = (food: IFoodPlate): void => {
    setEditingFood(food);
    toggleEditModal();
  };

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
