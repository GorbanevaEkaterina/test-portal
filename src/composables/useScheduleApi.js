import { ref } from "vue";

const API_BASE = "/student/schedule-open";

export function useScheduleIndex() {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchIndex = async () => {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(`${API_BASE}/api-index`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        if (res.status === 402) {
          const err = await res.json();
          throw new Error(err.error?.message || "Invalid params");
        }
        throw new Error(`HTTP ${res.status}`);
      }
      data.value = await res.json();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return { data, loading, error, fetchIndex };
}

export function useScheduleList() {
  const schedule = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const fetchList = async ({
    type,
    value,
    dateStart = null,
    dateEnd = null,
    mode = 'full' | 'compact', 
  }) => {
    if (!["group", "teacher", "classroom"].includes(type)) {
      error.value =
        "Неверный тип расписания. Допустимые значения: group, teacher, classroom.";
      return;
    }
    if (!value) {
      error.value =
        "Значение (название группы / ФИО преподавателя) обязательно.";
      return;
    }

    loading.value = true;
    error.value = null;

    const endpoint = mode === 'compact' ? 'api-compact' : 'api-list';

    const params = new URLSearchParams();
    params.append("type", type);
    params.append("value", value);
    if (dateStart) params.append("dateStart", dateStart);
    
    if (dateEnd && mode !== 'compact') params.append("dateEnd", dateEnd);

    try {
      const url = `${API_BASE}/${endpoint}?${params.toString()}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 402) {
          const err = await response.json();
          throw new Error(err.error?.message || "Неверные параметры запроса");
        }
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      schedule.value = await response.json();
    } catch (err) {
      error.value = err.message || "Не удалось загрузить расписание";
    } finally {
      loading.value = false;
    }
  };

  return { schedule, loading, error, fetchList };
}