package planup.backend.mapper;

import planup.backend.dto.SubTaskRequest;
import planup.backend.dto.SubTaskResponse;
import planup.backend.model.SubTask;

public class SubTaskMapper {
    public static SubTask toEntity(SubTaskRequest req){
        return SubTask.builder()
                .title(req.getTitle())
                .assigneeId(req.getAssigneeId())
                .status("To Do")
                .completed(false)
                .build();
    }

    public static SubTaskResponse toResponse(SubTask st){
        SubTaskResponse res=new SubTaskResponse();
        res.setId(st.getId());
        res.setTitle(st.getTitle());
        res.setStatus(st.getStatus());
        res.setCompleted(st.isCompleted());
        res.setAssigneeId(st.getAssigneeId());
        return res;
    }
}
