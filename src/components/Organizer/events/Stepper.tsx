interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
}

const Stepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step circle + label */}
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-primary/30 text-white"
                    : "bg-secondary/10 text-secondary/40"
                }`}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:block ${
                  isActive ? "text-white" : "text-secondary/60"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-4 ${
                  index < currentStep ? "bg-primary/40" : "bg-secondary/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;