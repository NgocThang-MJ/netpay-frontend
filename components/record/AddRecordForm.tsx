import { Fragment, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { FolderPlusIcon } from "@heroicons/react/24/outline";

import { Record, Attribute, RecordForm } from "types/record";

const attributes = [Attribute.MustHave, Attribute.NiceToHave, Attribute.Wasted];

let apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
if (process.env.NODE_ENV === "production") {
  apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD;
}

export default function AddRecordForm() {
  const queryClient = useQueryClient();

  const { register, handleSubmit, control, watch, reset, setFocus } =
    useForm<RecordForm>();
  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: (newRecord: Record) => {
      return axios.post(`${apiUrl}/records/create`, newRecord);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["records"] });
      setFocus("name");
      reset();
    },
  });

  const onSubmit: SubmitHandler<RecordForm> = (data) => {
    let date = data.date?.startDate
      ? new Date(data.date.startDate).toISOString()
      : new Date().toISOString();
    // Convert to YYYY/MM/DD
    date = date.slice(0, 10);

    // Get current time to sort in order
    let time = new Date().toISOString().slice(10);

    const insertData = {
      ...data,
      date: date + time,
      price: data.price.replaceAll(".", ""),
    };
    mutate(insertData);
  };

  useEffect(() => {
    setFocus("name");
  }, []);

  return (
    <div className="mr-10 border p-6 rounded-lg border-slate-700">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="block mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          className="py-2 px-3 rounded-lg mb-3 shadow-md w-full bg-slate-800 border-thin border-slate-600 outline-none"
          placeholder="Name"
          {...register("name")}
          required
        />

        <label className="block mb-2">Attribute</label>
        <Controller
          name="attribute"
          control={control}
          defaultValue={Attribute.MustHave}
          render={({ field }) => (
            <Listbox {...field}>
              <div className="relative mt-1 mb-2">
                <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-slate-800 border-slate-600 border-thin py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
                  <span className="block truncate">
                    {watch("attribute") || "MustHave"}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute border-thin border-t-0 rounded-t-none border-slate-600 z-50 max-h-60 w-full overflow-auto rounded-md bg-slate-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {attributes.map((attribute, index) => (
                      <Listbox.Option
                        key={index}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                            active ? "bg-slate-600 text-teal-400" : ""
                          }`
                        }
                        value={attribute}
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {attribute}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-teal-500">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          )}
        />

        <label htmlFor="price" className="block mb-1">
          Price
        </label>
        <Controller
          name="price"
          control={control}
          defaultValue="0"
          render={({ field }) => (
            <div className="w-full flex mb-3">
              <input
                type="text"
                id="price"
                className="py-2 px-3 rounded-lg block shadow-md grow border-thin border-slate-600 border-r-0 rounded-r-none bg-slate-800 outline-none"
                placeholder="Price"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    return field.onChange("0");
                  }
                  const isNumber = /^\d+$/.test(value.replaceAll(".", ""));
                  if (!isNumber) return;
                  return field.onChange(e.target.value);
                }}
                value={
                  new Intl.NumberFormat("vi-VN").format(
                    parseFloat(field.value.replaceAll(".", "") || "0")
                  ) || "0"
                }
                required
              />
              <label
                htmlFor="price"
                className="w-14 flex cursor-pointer items-center justify-center bg-slate-600 text-slate-300 rounded-r-lg border-r-[0.4px] border-slate-600"
              >
                VND
              </label>
            </div>
          )}
        />
        <label htmlFor="date" className="mb-1 block">
          Date
        </label>
        <Controller
          name="date"
          control={control}
          defaultValue={{
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
          }}
          render={({ field }) => (
            <Datepicker
              inputId="date"
              inputClassName="border-thin outline-none"
              useRange={false}
              asSingle={true}
              {...field}
              maxDate={new Date()}
              displayFormat={"DD/MM/YYYY"}
              primaryColor="teal"
            />
          )}
        />

        <button
          disabled={isAdding}
          type="submit"
          className="flex justify-center items-center mt-10 rounded-md border border-transparent bg-teal-600 px-3 py-[0.35rem] font-medium text-slate-200 hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <FolderPlusIcon className="h-4 w-4 mr-2" />
          <span>{isAdding ? "Adding..." : "Add"}</span>
        </button>
      </form>
    </div>
  );
}
