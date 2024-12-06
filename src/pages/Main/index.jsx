"use client";
import React, { useEffect, useState } from "react";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import { useForm } from "react-hook-form";
import { useClothesMutation, useSeasonMutation } from "../../services/auth.service";
import { Box, Button, Flex, Grid, Image, Text } from "@chakra-ui/react";
import s from "./index.module.scss";
import img1 from '../../assets/IMG_8946.jpg'
import img2 from '../../assets/IMG_8948.jpg'
import img3 from '../../assets/IMG_8949.jpg'
import img4 from '../../assets/IMG_8950.jpg'
import img5 from '../../assets/IMG_8952.jpg'
import img6 from '../../assets/IMG_8954.jpg'
import img7 from '../../assets/IMG_8956.jpg'

const Main = () => {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      gender: [""],
      season_id: ""
    }
  });

  const [clothes, setClothes] = useState([]);
  const [seasons, SetSeasons] = useState([]);
  const { mutate } = useSeasonMutation({
    onSuccess: (res) => {
      const formattedSeasons = res?.data?.response?.map((season) => ({
        value: season.guid,
        label: season.name,
      }));
      SetSeasons(formattedSeasons);
    }
  });

  const { mutate: generateClothes } = useClothesMutation({
    onSuccess: (response) => {
      setClothes(response?.data?.response);
    }
  });

  const [fromDegree, setFromDegree] = useState(null);
  const [toDegree, setToDegree] = useState(null);

  const API_KEY = "9f2b65c06589e9bcc829867591a46c84";
  const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const fetchLocationAndWeather = async () => {
    try {
      const position = await getLocation();
      const { latitude, longitude } = position.coords;

      const weatherResponse = await fetch(
        `${WEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      const currentTemperature = weatherData.main.temp;
      const ToDegree = weatherData.main.feels_like;

      const calculatedFromDegree = currentTemperature;
      const calculatedToDegree = ToDegree;

      setFromDegree(calculatedFromDegree);
      setToDegree(calculatedToDegree);

      setValue("from_degree", calculatedFromDegree);
      setValue("to_degree", calculatedToDegree);
    } catch (error) {
      console.error("Error getting location or weather:", error);
    }
  };

  useEffect(() => {
    fetchLocationAndWeather();
  }, []);

  useEffect(() => {
    const data = {
      data: {},
    };
    mutate(data);
  }, [mutate]);

  const generate = () => {
    const formData = watch();
    const requestData = {
      data: {
        from_degree: { $gt: formData.from_degree },
        to_degree: { $lt: formData.to_degree },
        season_id: formData.season_id || "",
        gender: [formData.gender],
      }
    };
    generateClothes(requestData);
  };

  const getRandomImage = () => {
    const images = [img1, img2, img3, img4, img5, img6, img7];
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  const handleFromDegreeChange = (value) => {
    const negativeValue = value < 0 ? value : -Math.abs(value);
    setValue("from_degree", negativeValue);
    setFromDegree(negativeValue);
  };
  const handleToDegreeChange = (value) => {
    const negativeValue = value < 0 ? value : +Math.abs(value);
    setValue("to_degree", negativeValue);
    setFromDegree(negativeValue);
  };

  return (
    <Flex mt={30} flexDir={"column"} gap={4} p={5}>
      <Grid gridTemplateColumns={"1fr 1fr"} gap={3}>
        <Flex gap={2} flexDir={"column"}>
          <Text>Градус погоды</Text>
          <FormInput
            name="from_degree"
            control={control}
            label="From Degree"
            type="number"
            defaultValue={fromDegree}
            onChange={(e) => handleFromDegreeChange(e.target.value)}
          />
        </Flex>
        <Flex gap={2} flexDir={"column"}>
          <Text>Ощущается как</Text>
          <FormInput
            name="to_degree"
            control={control}
            label="To Degree"
            type="number"
            onChange={(e) => handleToDegreeChange(e.target.value)}
            defaultValue={toDegree}
          />
        </Flex>
        <Flex gap={2} flexDir={"column"}>
          <Text>Выберите время года</Text>
          <FormSelect
            name="season_id"
            control={control}
            options={seasons}
            className={s.select}
          />
        </Flex>
        <Flex gap={2} flexDir={"column"}>
          <Text>Выберите пол</Text>
          <FormSelect
            className={s.select}
            name="gender"
            control={control}
            options={[
              { value: "men", label: "Male" },
              { value: "women", label: "Female" },
            ]}
            required
            placeholder="Select your gender"
          />
        </Flex>
      </Grid>
      <Button w={"100%"} onClick={() => generate()}>generate clothes</Button>

      <>
        {clothes.map((el) => (
          <Flex gap={4} key={el.guid}>
            <Image border={"1px solid #e7e7e7"} w={"300px"} h={"300px"} objectFit={"cover"} borderRadius={4} src={getRandomImage()} alt={el.name} />
            <Flex gap={5} flexDir={"column"}>
              <Text textTransform={"uppercase"} fontSize={"17px"} fontWeight={"600"}>Образ для {el.name}</Text>
              <Text fontSize={"17px"} fontWeight={"600"}>Можно одеть при градусе от {el.from_degree} до {el.to_degree} </Text>
            </Flex>
          </Flex>
        ))}
      </>
    </Flex>
  );
};

export default Main;
