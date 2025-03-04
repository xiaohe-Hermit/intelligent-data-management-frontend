import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:7001",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("dm-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProjects = async () => {
  try {
    const response = await api.get("/projects");
    return response.data; // 确保返回的数据是一个数组
  } catch (error) {
    console.error("获取项目失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await api.post("/projects", projectData);
    return response.data;
  } catch (error) {
    console.error("创建项目失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const updateProject = async (projectId, projectData) => {
  try {    
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
  } catch (error) {
    console.error("更新项目失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error("删除项目失败:", error);
    throw error.response ? error.response.data : error.message;
  }
};

// 获取所有项目ID与名称
export const getAllProjectIdAndProjectName = async () => {
  try {
    const response = await api.get("/projects");
    const projects = response.data.data;    
    const projectIdAndProjectName = projects.map((project) => ({
      projectId: project.project_id,
      projectName: project.project_name,
    }));        
    return projectIdAndProjectName;
  } catch (error) {
    console.error("获取项目名和ID失败:", error);
  }
};
// 根据项目ID获取项目名
export const getProjectNameByProjectId = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`);
    const project = response.data.data;
    if (!project.project_name) {
      throw new Error("项目名不存在");
    }
    return project.project_name;
  } catch (error) {
    console.error("获取项目名失败:", error);
  }
}