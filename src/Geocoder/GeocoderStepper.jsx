import { Flex, Text } from "@radix-ui/themes";
import { CheckIcon } from "@radix-ui/react-icons";

const steps = [
  { id: 1, label: "Input" },
  { id: 2, label: "Options" },
  { id: 3, label: "Results" },
];

const GeocoderStepper = ({ currentStep, setCurrentStep, canNavigateTo }) => {
  return (
    <Flex align="center" justify="center" className="w-full mb-4">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isClickable = canNavigateTo(step.id);

        return (
          <Flex key={step.id} align="center">
            {/* Step circle */}
            <Flex direction="column" align="center" gap="1">
              <button
                onClick={() => isClickable && setCurrentStep(step.id)}
                disabled={!isClickable}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-200
                  ${isCompleted
                    ? "bg-[#279989] text-white cursor-pointer hover:bg-[#228b7a]"
                    : isCurrent
                      ? "bg-[#004445] text-white"
                      : isClickable
                        ? "bg-gray-200 text-gray-500 cursor-pointer hover:bg-gray-300"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                {isCompleted ? (
                  <CheckIcon width="16" height="16" />
                ) : (
                  step.id
                )}
              </button>
              <Text
                size="1"
                weight={isCurrent ? "medium" : "regular"}
                className={isCurrent ? "text-[#004445]" : "text-gray-500"}
              >
                {step.label}
              </Text>
            </Flex>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div
                className={`
                  w-12 h-0.5 mx-2 mt-[-20px]
                  ${currentStep > step.id ? "bg-[#279989]" : "bg-gray-200"}
                `}
              />
            )}
          </Flex>
        );
      })}
    </Flex>
  );
};

export default GeocoderStepper;
