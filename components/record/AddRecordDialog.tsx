import { Fragment, useState } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Record, Attribute } from "types/record";

const attributes = [Attribute.MustHave, Attribute.NiceToHave, Attribute.Wasted];

let apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
if (process.env.NODE_ENV === "production") {
  apiUrl = process.env.NEXT_PUBLIC_API_URL_PROD;
}

export default function MyModal() {
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, control, watch } = useForm<Record>();
  const { mutate, isLoading } = useMutation({
    mutationFn: (newRecord: Record) => {
      return axios.post(`${apiUrl}/records/create`, newRecord);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["records"] });
      setIsOpen(false);
    },
  });

  const onSubmit: SubmitHandler<Record> = (data) => {
    mutate(data);
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-md bg-black bg-opacity-20 px-4 py-2 mb-1 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
      >
        Add new Record
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto text-slate-800">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-50 p-7 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl mb-4 font-medium leading-6 text-gray-900"
                  >
                    Add new Record
                  </Dialog.Title>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <label htmlFor="name" className="block mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="py-2 px-3 rounded-lg mb-3 shadow-md"
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
                              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300">
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
                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {attributes.map((attribute, index) => (
                                    <Listbox.Option
                                      key={index}
                                      className={({ active }) =>
                                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                                          active
                                            ? "bg-amber-100 text-amber-900"
                                            : "text-gray-900"
                                        }`
                                      }
                                      value={attribute}
                                    >
                                      {({ selected }) => (
                                        <>
                                          <span
                                            className={`block truncate ${
                                              selected
                                                ? "font-medium"
                                                : "font-normal"
                                            }`}
                                          >
                                            {attribute}
                                          </span>
                                          {selected ? (
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
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
                      <input
                        type="number"
                        id="price"
                        className="py-2 px-3 rounded-lg mb-3 block shadow-md"
                        placeholder="Price"
                        {...register("price")}
                        required
                      />

                      <label htmlFor="date" className="block mb-1">
                        Date
                      </label>
                      <input
                        type="text"
                        id="date"
                        className="py-2 px-3 rounded-lg mb-3 block shadow-md"
                        placeholder="Date"
                        {...register("date")}
                      />

                      <button
                        type="submit"
                        className="inline-flex justify-center mt-10 rounded-md border border-transparent bg-blue-100 px-4 py-2 font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      >
                        {isLoading ? "Submitting..." : "Submit"}
                      </button>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
