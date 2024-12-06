"use client";
import React, { useEffect, useState } from "react";
import FormInput from "../../components/ui/FormInput";
import FormSelect from "../../components/ui/FormSelect";
import { useForm } from "react-hook-form";
import { useClothesMutation, useSeasonMutation } from "../../services/auth.service";
import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import s from "./index.module.scss";

const Main = () => {
  const { control, watch, handleSubmit, setValue, getValues } = useForm(
    {
      defaultValues: {
        gender: [""]
      }
    }
  );
  const [seasons, SetSeasons] = useState([])
  const { mutate } = useSeasonMutation(
    {
      onSuccess: (res) => {
        const formattedSeasons = res?.data?.response?.map((season) => ({
          value: season.guid,
          label: season.name,
        }));
        SetSeasons(formattedSeasons);

      }
    }
  );
  const { mutate: generateClothes } = useClothesMutation()



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
    const subscription = watch((values) => {
      const data = {
        data: { ...values },
      };
      mutate(data);
    });

    return () => subscription.unsubscribe();
  }, [watch, mutate]);

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
          />
        </Flex>
        <Flex gap={2} flexDir={"column"}>
          <Text>Ощущается как</Text>
          <FormInput
            name="to_degree"
            control={control}
            label="To Degree"
            type="number"
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
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            required
            placeholder="Select your gender"
          />
        </Flex>
      </Grid>
      <Button w={"100%"} onClick={() => generate()}>generate clothes</Button>
    </Flex>
  );
};

export default Main;
