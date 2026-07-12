import { system, world } from "@minecraft/server";
import { WatchRegistry } from "./registry";
import { deepProxy } from "../utils";

export function DynamicProperty(name: string = "") {
  return function (target: any, propertyKey: string) {
    const defaultValue = target[propertyKey];
    const key = "debug:" + name + propertyKey;
    let value: any = undefined;
    let getter, setter;
    let saveIsLocked = false;

    const saveData = async (callback?: (value: any) => string) => {
      if (saveIsLocked) return;
      saveIsLocked = true;

      system.run(() => {
        world.setDynamicProperty(key, callback ? callback(value) : value);
        saveIsLocked = false;
      });
    };

    if (typeof defaultValue === "object") {
      getter = () => {
        if (value === undefined || value === null) {
          const property = world.getDynamicProperty(key) as string;

          if (property) {
            try {
              const data = JSON.parse(property);

              value = { ...defaultValue, ...data };
            } catch (error) {
              console.warn(`Failed to parse dynamic property "${propertyKey}":`, error);

              world.setDynamicProperty(key, JSON.stringify(defaultValue));
            }
          }

          value ??= defaultValue;

          value = deepProxy(value, () => {
            saveData(JSON.stringify);
          });
        }

        return value;
      };

      setter = (newValue: any) => {
        saveData(JSON.stringify);
        value = newValue;
      };
    } else {
      getter = () => value ?? world.getDynamicProperty(key) ?? defaultValue;
      setter = (newValue: any) => {
        saveData();
        value = newValue;
      };
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}

export function Watch(name: string) {
  return function (target: any, propertyKey: string) {
    const defaultValue = target[propertyKey];
    let value: any = undefined;
    let getter, setter;
    let saveIsLocked = false;

    const emit = () => {
      if (saveIsLocked) return;
      saveIsLocked = true;

      system.run(() => {
        saveIsLocked = false;
      });
    };

    if (typeof defaultValue === "object") {
      WatchRegistry.set(name, target[propertyKey]);

      getter = () => {
        if (value === undefined || value === null) {
          value ??= defaultValue;

          value = deepProxy(value, () => {
            emit();
          });
        }

        return value;
      };

      setter = (newValue: any) => {
        emit();
        value = newValue;
      };
    } else {
      getter = () => value ?? defaultValue;
      setter = (newValue: any) => {
        emit();
        value = newValue;
      };
    }

    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true,
    });
  };
}
